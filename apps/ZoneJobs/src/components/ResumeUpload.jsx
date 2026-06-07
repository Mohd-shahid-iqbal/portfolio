import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "./Icons";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024;

function isValidFile(f) {
  if (f.size > MAX_SIZE) return false;
  if (ACCEPTED_TYPES.includes(f.type)) return true;
  return /\.(pdf|doc|docx)$/i.test(f.name);
}

export default function ResumeUpload({ onResumeUpload, onParseStart, onParseDone, onParseError }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

  async function processFile(uploaded) {
    setError("");
    if (!isValidFile(uploaded)) {
      setError("Please upload a PDF, DOC, or DOCX file under 5 MB.");
      return;
    }
    setFile(uploaded);
    onResumeUpload?.(uploaded);
    onParseStart?.();
    try {
      const { extractTextFromResume, parseResumeTags } = await import("../services/resumeParser.js");
      const text = await extractTextFromResume(uploaded);
      const result = parseResumeTags(text);
      onParseDone?.(result);
    } catch (err) {
      console.error(err);
      onParseError?.(err.message || "Could not parse resume.");
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) processFile(selected);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    onResumeUpload?.(null);
    onParseDone?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 cursor-pointer
          transition-all duration-200 text-center
          ${isDragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]"
            : file
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10"
            : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {(file.size / 1024).toFixed(1)} KB · Parsed
              </p>
            </div>
            <button
              onClick={removeFile}
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              isDragActive ? "bg-indigo-100 dark:bg-indigo-900/40" : "bg-white dark:bg-slate-700 shadow-sm"
            }`}>
              {isDragActive ? (
                <Upload className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              ) : (
                <FileText className="w-7 h-7 text-slate-500 dark:text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Drag & drop or{" "}
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">browse files</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                PDF, DOC, DOCX · Max 5 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
