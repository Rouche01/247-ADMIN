import React, { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { getVideoCover } from "../../utils/getVideoPreview";

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000000;

const FileUploadInput = ({
  label,
  multiple,
  callUpdateFilesCb,
  accepts,
  setDuration,
}) => {
  const [files, setFiles] = useState({});
  const fileInputRef = useRef(null);

  const addNewFiles = async (newFiles) => {
    for (let file of newFiles) {
      if (file.size < DEFAULT_MAX_FILE_SIZE_IN_BYTES) {
        if (!multiple) {
          let isImageFile = file.type.split("/")[0] === "image";
          let preview;

          if (isImageFile) {
            preview = URL.createObjectURL(file);
          } else {
            const { blob, duration } = await getVideoCover(file);
            setDuration && setDuration(duration);
            preview = URL.createObjectURL(blob);
          }

          file.preview = preview;
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  };

  const removeFile = () => {
    setFiles({});
    callUpdateFilesCb({});
  };

  const handleNewFileUpload = async (ev) => {
    const { files: newFiles } = ev.target;
    if (newFiles.length) {
      let updatedFiles = await addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  return (
    <div className="mt-8">
      <label className="mb-2 font-medium inline-block text-white text-base">
        {label}
      </label>
      <div className="rounded-md w-full bg-247-dark-mode-input-bg p-4">
        {!Object.keys(files).length && (
          <div className="w-full relative rounded-md border border-dashed border-247-dotted-border bg-247-upload-bg flex-col text-center py-5 text-247-placeholder-shade cursor-pointer">
            <div className="mx-auto inline-block">
              <FiUploadCloud size={28} />
            </div>
            <p className="text-sm">
              Drag and drop or browse to choose {multiple ? "files" : "a file"}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="absolute top-0 left-0 bottom-0 right-0 w-full opacity-0 cursor-pointer"
              onChange={(ev) => handleNewFileUpload(ev)}
              accept={accepts ? accepts : ".jpg,.png,.jpeg,.mp4"}
            />
          </div>
        )}
        {!!Object.keys(files).length && (
          <div className="rounded-md max-h-52 relative group">
            <div className="absolute flex items-end justify-end rounded-md w-full h-full group-hover:visible group-hover:bg-247-overlay">
              <div
                onClick={removeFile}
                className="bg-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100  w-10 h-10 rounded-md mr-5 mb-5"
              >
                <FaTrash size={16} color="#f00" />
              </div>
            </div>
            {Object.keys(files).map((fileName, index) => {
              let file = files[fileName];
              return (
                <div key={fileName}>
                  <div>
                    <img
                      className="max-h-52 w-full object-cover rounded-md"
                      src={file.preview}
                      alt={`file preview ${index}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadInput;
