"""Corta clips de fondo para la presentación AESS-SAT (loops ping-pong, sin audio, 720p)."""
import subprocess, glob, os
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
SRC = r"c:\Users\Unimagdalena\Documents\IEEE\AESS\diapo"
OUT = os.path.join(SRC, "presentacion", "assets", "video")
os.makedirs(OUT, exist_ok=True)

DJI = glob.glob(SRC + "\\*DJI*.mp4")[0]
DRON = glob.glob(SRC + "\\La bah*.mp4")[0]
HIMNO = glob.glob(SRC + "\\HIMNO*.mp4")[0]

# crop: (w, h, x, y) as fractions -> removes watermarks / interpreter / lyrics
NOWM = "crop=iw*0.88:ih*0.88:0:0"          # drops bottom-right watermark
DRON_CROP = "crop=iw*0.85:ih*0.85:0:ih*0.075"  # drops right-side watermark
HIMNO_CROP = "crop=iw*0.70:ih*0.70:0:0"    # drops sign interpreter + lyrics

clips = [
    # name, src, start, dur, crop, slow, pingpong
    ("s1_amanecer", DJI, 0.4, 6.0, NOWM, 1.6, True),
    ("s2_territorio", DJI, 21.9, 7.0, NOWM, 1.3, True),
    ("s3_puerto", DJI, 15.1, 3.7, NOWM, 1.8, True),
    ("s4_agua", DJI, 19.5, 1.5, NOWM, 2.2, True),
    ("s5_lab", HIMNO, 32.3, 3.0, HIMNO_CROP, 1.5, True),
    ("s6_horizonte", DRON, 40.0, 10.0, DRON_CROP, 1.3, True),
    ("s7_bahia", DRON, 60.0, 8.0, DRON_CROP, 1.3, True),
    ("s8_campus", HIMNO, 4.1, 1.8, "crop=iw:ih:0:0", 1.8, True),
    ("s9_atardecer", DJI, 22.5, 6.3, NOWM, 1.4, True),
]

for name, src, ss, d, crop, slow, pp in clips:
    out = os.path.join(OUT, name + ".mp4")
    base = f"{crop},scale=1280:720:flags=lanczos,setsar=1,setpts={slow}*PTS,fps=30"
    if pp:
        vf = f"[0:v]{base},split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]"
    else:
        vf = f"[0:v]{base},format=yuv420p[v]"
    cmd = [FF, "-y", "-loglevel", "error", "-ss", str(ss), "-t", str(d), "-i", src,
           "-filter_complex", vf, "-map", "[v]", "-an",
           "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)
    poster = os.path.join(OUT, name + ".jpg")
    subprocess.run([FF, "-y", "-loglevel", "error", "-i", out, "-frames:v", "1", "-q:v", "4", poster], check=True)
    print(name, round(os.path.getsize(out) / 1e6, 2), "MB")

