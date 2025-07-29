# Network Packet Logger

A lightweight network packet capture and logging tool written in Go. This tool captures network packets from specified interfaces and logs detailed information about Ethernet, IP, TCP, and UDP layers to both console and file outputs.

## Features

- **Real-time packet capture** from network interfaces
- **Multi-layer analysis** - Ethernet, IPv4, TCP, and UDP protocol parsing
- **Flexible filtering** - Support for Berkeley Packet Filter (BPF) expressions
- **Dual output** - Simultaneous logging to console and timestamped log files
- **Device discovery** - List all available network interfaces
- **Detailed logging** - MAC addresses, IP addresses, ports, protocol flags, and payload sizes

## Prerequisites

### Dependencies

The application requires the following Go packages:
- `github.com/google/gopacket` - Packet processing library
- `github.com/google/gopacket/pcap` - libpcap bindings

### System Requirements

**libpcap** must be installed on your system:

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install libpcap-dev
```

#### Linux (CentOS/RHEL/Fedora)
```bash
# CentOS/RHEL
sudo yum install libpcap-devel

# Fedora
sudo dnf install libpcap-devel
```

#### macOS
```bash
# Using Homebrew
brew install libpcap

# libpcap is usually pre-installed on macOS
```

#### Windows
- Install [WinPcap](https://www.winpcap.org/) or [Npcap](https://nmap.org/npcap/)
- Install a C compiler (like TDM-GCC or mingw-w64)

## Installation

1. **Clone or download** the packet logger source code

2. **Initialize Go module** and install dependencies:
```bash
go mod init packet-logger
go get github.com/google/gopacket
go get github.com/google/gopacket/pcap
```

3. **Build the application**:
```bash
go build -o packet-logger main.go
```

## Usage

### Command Structure
```bash
./packet-logger <command> [options]
```

### Available Commands

#### List Network Devices
Display all available network interfaces:
```bash
./packet-logger list
```

**Example output:**
```
Available network devices:
1. eth0 (Ethernet adapter)
   IP: 192.168.1.100
2. lo (Loopback adapter)
   IP: 127.0.0.1
3. wlan0 (Wireless adapter)
   IP: 192.168.1.150
```

#### Capture Packets
Start packet capture on a specified interface:
```bash
./packet-logger capture <interface> [filter]
```

**Parameters:**
- `<interface>` - Network interface name (e.g., eth0, wlan0, en0)
- `[filter]` - Optional BPF filter expression

### Usage Examples

#### Basic Packet Capture
```bash
# Capture all packets on eth0
sudo ./packet-logger capture eth0
```

#### Filtered Packet Capture
```bash
# Capture HTTP traffic only
sudo ./packet-logger capture eth0 "tcp port 80"

# Capture HTTPS traffic
sudo ./packet-logger capture eth0 "tcp port 443"

# Capture DNS queries
sudo ./packet-logger capture eth0 "udp port 53"

# Capture traffic to/from specific IP
sudo ./packet-logger capture eth0 "host 192.168.1.1"

# Capture TCP traffic on multiple ports
sudo ./packet-logger capture eth0 "tcp port 80 or tcp port 443"
```

## BPF Filter Examples

| Filter Expression | Description |
|-------------------|-------------|
| `tcp` | TCP packets only |
| `udp` | UDP packets only |
| `icmp` | ICMP packets only |
| `port 22` | SSH traffic (both TCP and UDP) |
| `tcp port 22` | SSH traffic (TCP only) |
| `host 8.8.8.8` | Traffic to/from Google DNS |
| `net 192.168.1.0/24` | Traffic within subnet |
| `not port 22` | All traffic except SSH |
| `tcp and not port 22` | TCP traffic excluding SSH |

## Output Format

### Log File
Packets are logged to timestamped files in the format: `packets_YYYYMMDD_HHMMSS.log`

### Log Entry Structure
```
[TIMESTAMP] ETH[SRC_MAC -> DST_MAC] IP[SRC_IP -> DST_IP] Proto:PROTOCOL Len:LENGTH TCP/UDP[SRC_PORT -> DST_PORT] [FLAGS] PayloadLen:SIZE TotalLen:TOTAL
```

### Sample Output
```
[2025-07-28 10:30:15.123] ETH[aa:bb:cc:dd:ee:ff -> 11:22:33:44:55:66] IP[192.168.1.100 -> 93.184.216.34] Proto:TCP Len:52 TCP[54321 -> 80] Seq:1234567890 Ack:987654321 Flags:[SYN,ACK] PayloadLen:0 TotalLen:66
[2025-07-28 10:30:15.156] ETH[11:22:33:44:55:66 -> aa:bb:cc:dd:ee:ff] IP[93.184.216.34 -> 192.168.1.100] Proto:TCP Len:1460 TCP[80 -> 54321] Seq:987654321 Ack:1234567891 Flags:[ACK,PSH] PayloadLen:1408 TotalLen:1474
```

## Permissions

**Root/Administrator privileges are required** for packet capture on most systems:

#### Linux/macOS
```bash
sudo ./packet-logger capture eth0
```

#### Alternative: Grant Capabilities (Linux)
Instead of running as root, you can grant specific capabilities:
```bash
sudo setcap cap_net_raw,cap_net_admin=eip ./packet-logger
./packet-logger capture eth0
```

## Troubleshooting

### Common Issues

#### "Permission denied" error
- **Solution**: Run with `sudo` or grant appropriate capabilities
- **Windows**: Run as Administrator

#### "No such device" error
- **Solution**: Use `./packet-logger list` to see available interfaces
- **Common interface names**: 
  - Linux: `eth0`, `wlan0`, `enp0s3`
  - macOS: `en0`, `en1`
  - Windows: `\Device\NPF_{GUID}`

#### "libpcap not found" during compilation
- **Solution**: Install libpcap development headers (see Prerequisites)

#### No packets captured
- **Check interface status**: Ensure the interface is up and active
- **Verify filter syntax**: Test with no filter first, then add filters
- **Check permissions**: Ensure running with appropriate privileges

### Performance Considerations

- **High traffic environments**: Consider using more specific filters to reduce overhead
- **Log file size**: Monitor log file growth, especially on busy networks
- **Buffer settings**: The default snap length is 1024 bytes; adjust if needed for full packet capture

## Development

### Project Structure
```
packet-logger/
├── main.go           # Main application code
├── go.mod           # Go module definition
├── go.sum           # Dependency checksums
└── README.md        # This file
```

### Extending the Logger

The code is structured to be easily extensible:
- **Add new protocols**: Extend the `logPacket()` function
- **Custom output formats**: Modify the logging format
- **Additional filters**: Implement custom packet filtering logic
- **Performance metrics**: Add packet count and bandwidth statistics

## License

This project is provided as-is for educational and monitoring purposes. Ensure compliance with your organization's network monitoring policies and applicable laws when using this tool.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this packet logger.

---

**⚠️ Important**: Only use this tool on networks you own or have explicit permission to monitor. Unauthorized network monitoring may violate laws and policies.
