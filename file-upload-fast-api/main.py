from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    
    with open(f"uploaded_{file.filename}", "wb") as f:
        f.write(content)

    return JSONResponse({
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content)
    })

@app.post("/upload-multiple/")
async def upload_files(files: list[UploadFile] = File(...)):
    return [file.filename for file in files]
