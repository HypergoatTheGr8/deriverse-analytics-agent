#!/usr/bin/env python3
"""
Simple screen recording script using ffmpeg
Creates a demo video showing Deriverse Dashboard functionality
"""
import subprocess
import time
import os
import signal

def create_demo_video():
    """Create a 60-second demo video of the dashboard"""
    print("Creating demo video...")
    
    # Create screenshots directory if needed
    if not os.path.exists("demo"):
        os.makedirs("demo")
    
    # Step 1: Capture initial dashboard view (5 seconds)
    print("1. Capturing dashboard overview...")
    subprocess.run([
        "ffmpeg", "-y",
        "-f", "x11grab",  # Use X11 for screen capture (won't work without display)
        "-video_size", "1920x1080",
        "-framerate", "30",
        "-i", ":0.0+0,0",
        "-t", "5",
        "demo/part1.mp4"
    ], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    
    print("Note: Screen recording requires GUI display. Creating alternative demo...")
    
    # Alternative: Create slideshow from existing screenshots
    create_slideshow()
    
def create_slideshow():
    """Create slideshow from existing screenshots"""
    print("Creating slideshow from screenshots...")
    
    # List of screenshots with captions
    screenshots = [
        ("screenshots/dashboard-1770116661916.png", "Dashboard Overview"),
        ("screenshots/dashboard-1770116522538.png", "Performance Metrics"),
        ("screenshots/dashboard-1770115802818.png", "AI Insights Panel"),
        ("screenshots/dashboard-1770117297763.png", "Trade History")
    ]
    
    # Create individual image frames with text
    for i, (img_path, caption) in enumerate(screenshots):
        output = f"demo/frame{i:02d}.jpg"
        
        # Add caption to image using ffmpeg
        subprocess.run([
            "ffmpeg", "-y",
            "-i", img_path,
            "-vf", f"drawtext=text='{caption}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-50",
            output
        ], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    
    # Create video from frames
    print("Creating slideshow video...")
    subprocess.run([
        "ffmpeg", "-y",
        "-framerate", "1",  # 1 frame per second
        "-pattern_type", "glob",
        "-i", "demo/frame*.jpg",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-vf", "fps=30",
        "demo/dashboard-demo.mp4"
    ], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    
    # Add music/background (optional)
    print("Demo video created: demo/dashboard-demo.mp4")
    
    # Also create GIF version
    create_gif()
    
def create_gif():
    """Create animated GIF from screenshots"""
    print("Creating animated GIF...")
    
    # Convert screenshots to GIF frames
    screenshots = [
        "screenshots/dashboard-1770116661916.png",
        "screenshots/dashboard-1770116522538.png",
        "screenshots/dashboard-1770115802818.png",
        "screenshots/dashboard-1770117297763.png"
    ]
    
    # Create GIF
    subprocess.run([
        "convert",
        "-delay", "500",  # 500ms between frames
        "-loop", "0",
        "-resize", "800x600",
    ] + screenshots + ["demo/dashboard-demo.gif"])
    
    print("GIF created: demo/dashboard-demo.gif")
    
    # Optimize GIF
    subprocess.run([
        "gifsicle", "-O3", "--colors", "256",
        "demo/dashboard-demo.gif",
        "-o", "demo/dashboard-demo-optimized.gif"
    ], stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    
    print("Optimized GIF: demo/dashboard-demo-optimized.gif")

if __name__ == "__main__":
    create_demo_video()