package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type PacketLogger struct {
	handle  *pcap.Handle
	logFile *os.File
	device  string
	filter  string
	snaplen int32
	promisc bool
	timeout time.Duration
}

// NewPacketLogger creates a new packet logger instance
func NewPacketLogger(device, logPath, filter string) (*PacketLogger, error) {
	// Open log file
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		return nil, fmt.Errorf("failed to open log file: %v", err)
	}

	return &PacketLogger{
		logFile: logFile,
		device:  device,
		filter:  filter,
		snaplen: 1024,
		promisc: false,
		timeout: 30 * time.Second,
	}, nil
}

// Start begins packet capture and logging
func (pl *PacketLogger) Start() error {
	// Open device for capture
	handle, err := pcap.OpenLive(pl.device, pl.snaplen, pl.promisc, pl.timeout)
	if err != nil {
		return fmt.Errorf("failed to open device %s: %v", pl.device, err)
	}
	pl.handle = handle

	// Set BPF filter if provided
	if pl.filter != "" {
		err = handle.SetBPFFilter(pl.filter)
		if err != nil {
			return fmt.Errorf("failed to set BPF filter: %v", err)
		}
	}

	fmt.Printf("Starting packet capture on device: %s\n", pl.device)
	if pl.filter != "" {
		fmt.Printf("Using filter: %s\n", pl.filter)
	}

	// Create packet source
	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())

	// Process packets
	for packet := range packetSource.Packets() {
		pl.logPacket(packet)
	}

	return nil
}

// logPacket processes and logs a single packet
func (pl *PacketLogger) logPacket(packet gopacket.Packet) {
	timestamp := time.Now().Format("2006-01-02 15:04:05.000")

	// Basic packet info
	logEntry := fmt.Sprintf("[%s] ", timestamp)

	// Extract layers
	ethernetLayer := packet.Layer(layers.LayerTypeEthernet)
	ipLayer := packet.Layer(layers.LayerTypeIPv4)
	tcpLayer := packet.Layer(layers.LayerTypeTCP)
	udpLayer := packet.Layer(layers.LayerTypeUDP)

	if ethernetLayer != nil {
		ethernet, _ := ethernetLayer.(*layers.Ethernet)
		logEntry += fmt.Sprintf("ETH[%s -> %s] ", ethernet.SrcMAC, ethernet.DstMAC)
	}

	if ipLayer != nil {
		ip, _ := ipLayer.(*layers.IPv4)
		logEntry += fmt.Sprintf("IP[%s -> %s] ", ip.SrcIP, ip.DstIP)
		logEntry += fmt.Sprintf("Proto:%s Len:%d ", ip.Protocol, ip.Length)
	}

	if tcpLayer != nil {
		tcp, _ := tcpLayer.(*layers.TCP)
		logEntry += fmt.Sprintf("TCP[%d -> %d] ", tcp.SrcPort, tcp.DstPort)
		logEntry += fmt.Sprintf("Seq:%d Ack:%d ", tcp.Seq, tcp.Ack)

		// TCP flags
		flags := []string{}
		if tcp.SYN {
			flags = append(flags, "SYN")
		}
		if tcp.ACK {
			flags = append(flags, "ACK")
		}
		if tcp.FIN {
			flags = append(flags, "FIN")
		}
		if tcp.RST {
			flags = append(flags, "RST")
		}
		if tcp.PSH {
			flags = append(flags, "PSH")
		}
		if tcp.URG {
			flags = append(flags, "URG")
		}

		if len(flags) > 0 {
			logEntry += fmt.Sprintf("Flags:[%s] ", joinStrings(flags, ","))
		}
	}

	if udpLayer != nil {
		udp, _ := udpLayer.(*layers.UDP)
		logEntry += fmt.Sprintf("UDP[%d -> %d] Len:%d ", udp.SrcPort, udp.DstPort, udp.Length)
	}

	// Add payload size
	if app := packet.ApplicationLayer(); app != nil {
		logEntry += fmt.Sprintf("PayloadLen:%d ", len(app.Payload()))
	}

	logEntry += fmt.Sprintf("TotalLen:%d\n", len(packet.Data()))

	// Write to log file
	pl.logFile.WriteString(logEntry)

	// Also print to console
	fmt.Print(logEntry)
}

// Stop closes the packet capture handle and log file
func (pl *PacketLogger) Stop() {
	if pl.handle != nil {
		pl.handle.Close()
	}
	if pl.logFile != nil {
		pl.logFile.Close()
	}
	fmt.Println("Packet logger stopped")
}

// Helper function to join strings
func joinStrings(strs []string, sep string) string {
	if len(strs) == 0 {
		return ""
	}
	result := strs[0]
	for i := 1; i < len(strs); i++ {
		result += sep + strs[i]
	}
	return result
}

// listDevices prints available network devices
func listDevices() {
	devices, err := pcap.FindAllDevs()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Available network devices:")
	for i, device := range devices {
		fmt.Printf("%d. %s", i+1, device.Name)
		if device.Description != "" {
			fmt.Printf(" (%s)", device.Description)
		}
		fmt.Println()

		for _, addr := range device.Addresses {
			fmt.Printf("   IP: %s\n", addr.IP)
		}
	}
}

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("Usage: %s <command> [options]\n", os.Args[0])
		fmt.Println("Commands:")
		fmt.Println("  list                    - List available network devices")
		fmt.Println("  capture <device> [filter] - Start packet capture")
		fmt.Println("Examples:")
		fmt.Println("  go run main.go list")
		fmt.Println("  go run main.go capture eth0")
		fmt.Println("  go run main.go capture eth0 \"tcp port 80\"")
		os.Exit(1)
	}

	command := os.Args[1]

	switch command {
	case "list":
		listDevices()
	case "capture":
		if len(os.Args) < 3 {
			fmt.Println("Error: device name required for capture command")
			os.Exit(1)
		}

		device := os.Args[2]
		filter := ""
		if len(os.Args) > 3 {
			filter = os.Args[3]
		}

		// Create log filename with timestamp
		logPath := fmt.Sprintf("packets_%s.log", time.Now().Format("20060102_150405"))

		logger, err := NewPacketLogger(device, logPath, filter)
		if err != nil {
			log.Fatalf("Failed to create packet logger: %v", err)
		}
		defer logger.Stop()

		fmt.Printf("Logging packets to: %s\n", logPath)

		// Start capture (this blocks)
		if err := logger.Start(); err != nil {
			log.Fatalf("Failed to start packet capture: %v", err)
		}
	default:
		fmt.Printf("Unknown command: %s\n", command)
		os.Exit(1)
	}
}
