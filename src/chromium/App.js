/* global chrome */
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

function App() {
  const [pageInfo, setPageInfo] = useState({ title: "", url: "" });
  const [headerVisible, setHeaderVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [showRemoveLinkTooltip, setShowRemoveLinkTooltip] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showEditTitleIcon, setShowEditTitleIcon] = useState(false);
  const [isTitleInFocus, setIsTitleInFocus] = useState(false);

  const [obsidianVault, setObsidianVault] = useState(null);
  const [folderPath, setFolderPath] = useState(null);
  const [noteContentFormat, setNoteContentFormat] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const titleInputRef = useRef();
  const textAreaRef = useRef();
  const containerRef = useRef();
  const menuRef = useRef();

  const removeLinkButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const saveButtonRef = useRef(null);
  const hamburgerMenuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        hamburgerMenuButtonRef.current &&
        !hamburgerMenuButtonRef.current.contains(e.target)
      ) {
        setShowHamburgerMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (title.trim() === "" && content.trim() === "" && !headerVisible) {
      setSaveButtonDisabled(true);
    } else if (errorMsg) {
      setSaveButtonDisabled(true);
    } else {
      setSaveButtonDisabled(false);
    }
  }, [title, content, headerVisible, errorMsg]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const getPageInfo = async () => {
      setLoading(true);
      try {
        const tabs = await new Promise((resolve) => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs);
          });
        });
        const tab = tabs[0];
        setPageInfo({ title: tab.title, url: tab.url });
        setTitle(sanitizeTitle(tab.title));
      } catch (error) {
        console.error("Error getting page info: ", error);
      } finally {
        setLoading(false);
      }
    };

    getPageInfo();
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const result = await new Promise((resolve) => {
          chrome.storage.sync.get(
            ["obsidianVault", "folderPath", "noteContentFormat"],
            (result) => {
              resolve(result);
            }
          );
        });
        if (result.obsidianVault) {
          setObsidianVault(result.obsidianVault);
        }
        if (result.folderPath) {
          setFolderPath(result.folderPath);
        }
        if (result.noteContentFormat) {
          setNoteContentFormat(result.noteContentFormat);
        } else {
          // Set default note format if not found in storage
          setNoteContentFormat("{url}\n\n{content}");
        }
      } catch (error) {
        console.error("Error loading settings: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    <div className="h-44 flex items-center justify-center">
      <div className="my-spinner w-5 h-5 border-t-2 border-zinc-700 border-solid rounded-full"></div>
    </div>;
  }

  const saveNote = async () => {
    // Redirect to the options page if obsidianVault or folderPath is not set
    if (!obsidianVault || !folderPath) {
      chrome.runtime.openOptionsPage();
      return;
    }

    if (title.length > 250) {
      setErrorMsg("Title is too long");
      return;
    }

    // Format the note content using the custom note format
    const date = new Date().toLocaleDateString("en-CA");
    let newContent = noteContentFormat
      .replace("{url}", headerVisible ? pageInfo.url : "")
      .replace("{title}", title)
      .replace("{content}", content)
      .replace("{date}", date);

    // Remove only the empty line that would have contained the URL if not visible
    if (!headerVisible) {
      const lines = newContent.split("\n");
      const urlIndex = lines.findIndex((line) => line.trim() === "");
      if (urlIndex !== -1) {
        lines.splice(urlIndex, 1);
      }
      newContent = lines.join("\n");
    }

    // Remove the line for content if it's empty
    if (content.trim() === "") {
      const lines = newContent.split("\n");
      const contentIndex = lines.findIndex((line) => line.trim() === "");
      if (contentIndex !== -1) {
        lines.splice(contentIndex, 1);
      }
      newContent = lines.join("\n");
    }

    // Replace {title} with the sanitized page title in the folderPath
    const sanitizedTitle = sanitizeTitle(title);
    const finalFolderPath = folderPath.replace("{title}", sanitizedTitle);

    try {
      // Generate the Obsidian URI
      const obsidianUri = `obsidian://new?vault=${encodeURIComponent(
        obsidianVault
      )}&file=${encodeURIComponent(
        finalFolderPath
      )}&content=${encodeURIComponent(newContent)}`;

      // Open the URI in a new tab
      window.open(obsidianUri, "_blank");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding note: ", error);
    }
  };

  const handleCancel = () => {
    // Clear title and content
    setTitle("");
    setContent("");
    window.close();
  };

  const selectAllInputText = () => {
    titleInputRef.current.select();
    setShowEditTitleIcon(false);
  };

  const sanitizeTitle = (title) => {
    const invalidCharacterPattern = /[\\:*?"<>|/]/g;
    return title.replace(invalidCharacterPattern, "-");
  };

  const handleTitleChange = (e) => {
    const sanitizedValue = sanitizeTitle(e.target.value);
    if (sanitizedValue !== e.target.value) {
      setErrorMsg(
        'The title contains invalid characters. Please avoid using these characters in the title: \\ : * ? " < > | /'
      );
    } else if (sanitizedValue.length > 250) {
      setErrorMsg("The title is too long");
    } else {
      setErrorMsg("");
    }
    setTitle(e.target.value);
  };

  const donateRedirect = () => {
    chrome.tabs.create({
      url: "https://www.paypal.com/donate/?hosted_button_id=M8RTMTXKV46EC",
    });
  };

  const optionsRedirect = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div
      ref={containerRef}
      className="relative max-w-lg mx-auto border-2 border-zinc-700 shadow-xl bg-zinc-50"
    >
      {headerVisible && (
        <div className="flex justify-between mb-1 border-b-2 border-zinc-700 bg-zinc-100">
          <div className="text-xs p-2 truncate">{pageInfo.url}</div>
          <button
            ref={removeLinkButtonRef}
            className="text-black rounded-full p-1 hover:bg-zinc-200 active:bg-zinc-300 relative"
            onClick={() => setHeaderVisible(false)}
            onMouseEnter={() => setShowRemoveLinkTooltip(true)}
            onMouseLeave={() => setShowRemoveLinkTooltip(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M14 11.998C14 9.506 11.683 7 8.857 7H7.143C4.303 7 2 9.238 2 11.998c0 2.378 1.71 4.368 4 4.873a5.3 5.3 0 0 0 1.143.124M16.857 7c.393 0 .775.043 1.143.124c2.29.505 4 2.495 4 4.874a4.92 4.92 0 0 1-1.634 3.653" />
                <path d="M10 11.998c0 2.491 2.317 4.997 5.143 4.997M18 22.243l2.121-2.122m0 0L22.243 18m-2.122 2.121L18 18m2.121 2.121l2.122 2.122" />
              </g>
            </svg>
          </button>
          {showRemoveLinkTooltip && (
            <div className="absolute top-8 right-0 text-xs bg-zinc-700 text-white p-2 rounded whitespace-nowrap z-10">
              Remove page link
            </div>
          )}
        </div>
      )}
      <div
        className="relative flex items-center"
        onMouseEnter={() => !isTitleInFocus && setShowEditTitleIcon(true)}
        onMouseLeave={() => setShowEditTitleIcon(false)}
      >
        <input
          ref={titleInputRef}
          type="text"
          name="title"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-2 mb-0 focus:border-none focus:ring-0 textarea-title font-semibold bg-zinc-50 text-base"
          placeholder="Add title"
          autoComplete="no-autocomplete-please"
          maxLength={250}
          onFocus={() => {
            setIsTitleInFocus(true);
            setShowEditTitleIcon(false);
          }}
          onBlur={() => {
            setIsTitleInFocus(false);
            setShowEditTitleIcon(false);
          }}
        />
        {showEditTitleIcon && (
          <div className="absolute right-0 transform translate-y-[-50%] cursor-pointer top-5">
            <button
              onClick={selectAllInputText}
              className="text-black rounded-full p-1 hover:bg-zinc-200 active:bg-zinc-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m19.3 8.925l-4.25-4.2l1.4-1.4q.575-.575 1.413-.575t1.412.575l1.4 1.4q.575.575.6 1.388t-.55 1.387L19.3 8.925ZM17.85 10.4L7.25 21H3v-4.25l10.6-10.6l4.25 4.25Z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {errorMsg && (
        <div className="text-red-500 text-xs m-2 p-0.5 rounded-md bg-zinc-100">
          {errorMsg}
        </div>
      )}
      <TextareaAutosize
        ref={textAreaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 focus:border-none focus:ring-0 textarea-content resize-none bg-zinc-50 text-sm"
        placeholder="Take a brief note..."
        minRows={4}
        autoComplete="no-autocomplete-please"
        maxLength={1500}
      ></TextareaAutosize>
      <div className="flex justify-between w-full pr-2 pb-1 items-center">
        <div>
          <button
            ref={hamburgerMenuButtonRef}
            className={`p-1 rounded-full hover:bg-zinc-200 active:bg-zinc-300 ${
              showHamburgerMenu ? "bg-zinc-200" : ""
            }`}
            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          {showHamburgerMenu && (
            <div
              ref={menuRef}
              className="fixed bottom-11 left-1 bg-zinc-200 rounded-md shadow-lg"
            >
              <button
                className="block w-full text-left py-2 px-2 hover:bg-zinc-300 active:bg-zinc-400 rounded-md"
                onClick={optionsRedirect}
              >
                Options
              </button>
              <button
                className="block w-full text-left py-2 px-2 hover:bg-zinc-300 active:bg-zinc-400 rounded-md"
                onClick={donateRedirect}
              >
                Donate
              </button>
            </div>
          )}
        </div>
        <div className="text-sm">
          <button
            ref={cancelButtonRef}
            className="py-1 px-2 mr-2 bg-zinc-50 rounded hover:bg-zinc-200 active:bg-zinc-300 font-semibold text-zinc-800"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            ref={saveButtonRef}
            className={`py-1 px-2 bg-white rounded font-semibold  ${
              saveButtonDisabled
                ? "opacity-50 cursor-not-allowed bg-zinc-50 hover:bg-zinc-50 text-zinc-800"
                : "bg-zinc-50 hover:bg-indigo-100 hover:text-indigo-700 active:bg-indigo-200"
            }`}
            onClick={saveNote}
            disabled={saveButtonDisabled}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
