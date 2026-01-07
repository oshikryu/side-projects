#!/usr/bin/env python3
"""
Simple script to query an LLM with text input and print the response.
Requires: pip install anthropic
Set your API key: export ANTHROPIC_API_KEY='your-key-here'
"""

import sys
import os
from anthropic import Anthropic


def query_llm(prompt: str, model: str = "claude-sonnet-4-5-20250929") -> str:
    """
    Query the LLM with the given prompt and return the response.

    Args:
        prompt: The text prompt to send to the LLM
        model: The model to use (default: claude-sonnet-4-5)

    Returns:
        The LLM's response as a string
    """
    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    message = client.messages.create(
        model=model,
        max_tokens=4096,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return message.content[0].text


def main():
    """Main function to handle input and output."""
    # Check for API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable not set", file=sys.stderr)
        print("Set it with: export ANTHROPIC_API_KEY='your-key-here'", file=sys.stderr)
        sys.exit(1)

    # Get input from command line arguments or stdin
    if len(sys.argv) > 1:
        # Use command line arguments as the prompt
        prompt = " ".join(sys.argv[1:])
    else:
        # Read from stdin
        print("Enter your prompt (Ctrl+D or Ctrl+Z when done):")
        prompt = sys.stdin.read().strip()

    if not prompt:
        print("Error: No input provided", file=sys.stderr)
        sys.exit(1)

    # Query the LLM
    try:
        response = query_llm(prompt)
        print(response)
    except Exception as e:
        print(f"Error querying LLM: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
