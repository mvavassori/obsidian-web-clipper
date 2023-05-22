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

  const titleInputRef = useRef();
  const textAreaRef = useRef();
  const containerRef = useRef();
  const menuRef = useRef();

  const removeLinkButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const saveButtonRef = useRef(null);
  const hamburgerMenuButtonRef = useRef(null);

  // Add useEffect hook to handle click events
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      setPageInfo({ title: tab.title, url: tab.url });
      setTitle(tab.title); // Set the title state with the current page's title
    });
  }, []);

  useEffect(() => {
    if (title.trim() === "" && content.trim() === "" && !headerVisible) {
      setSaveButtonDisabled(true);
    } else {
      setSaveButtonDisabled(false);
    }
  }, [title, content, headerVisible]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  const handleRemoveLink = () => {
    setHeaderVisible(false);
  };

  const saveNote = async () => {
    if (!content && !headerVisible) return;

    // Prepend the page link and an empty row to the content, if the header is visible
    const newContent = headerVisible
      ? content
        ? `${pageInfo.url}\n\n${content}`
        : pageInfo.url
      : content;

    const obsidianVault = "Obsidian Vault"; //todo: save the vault name the user creates in extension options
    const folderPath = "Web Notes"; //todo: save the folder path the user creates in extension options

    try {
      // Generate the Obsidian URI
      const obsidianUri = `obsidian://new?vault=${encodeURIComponent(
        obsidianVault
      )}&file=${encodeURIComponent(
        folderPath + "/" + title
      )}&content=${encodeURIComponent(newContent)}`;

      // Open the URI in a new tab
      window.open(obsidianUri, "_blank");
      setTitle("");
      setContent("");
      // window.close();
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

  const logout = async () => {
    try {
      // await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const websiteRedirect = () => {
    chrome.tabs.create({ url: "http://localhost:3000/main" });
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
            className="text-black rounded-full p-1 hover:bg-zinc-200 relative"
            onClick={handleRemoveLink}
            onMouseEnter={() => setShowRemoveLinkTooltip(true)}
            onMouseLeave={() => setShowRemoveLinkTooltip(false)}
          >
            {showRemoveLinkTooltip && (
              <div className="absolute top-8 right-0 text-xs bg-zinc-700 text-white p-2 rounded whitespace-nowrap">
                Remove page link
              </div>
            )}
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 3V0H5V3H4ZM9.31802 0.974873C9.94222 0.350672 10.7888 0 11.6716 0C13.5098 0 15 1.49019 15 3.32843C15 4.21118 14.6493 5.05778 14.0251 5.68198L10.8536 8.85355L10.1464 8.14645L13.318 4.97487C13.7547 4.53821 14 3.94596 14 3.32843C14 2.04247 12.9575 1 11.6716 1C11.054 1 10.4618 1.24532 10.0251 1.68198L6.85355 4.85355L6.14645 4.14645L9.31802 0.974873ZM0 4H3V5H0V4ZM10.8536 4.85355L4.85355 10.8536L4.14645 10.1464L10.1464 4.14645L10.8536 4.85355ZM4.85355 6.85355L1.68198 10.0251C1.24532 10.4618 1 11.054 1 11.6716C1 12.9575 2.04247 14 3.32843 14C3.94596 14 4.53821 13.7547 4.97487 13.318L8.14645 10.1464L8.85355 10.8536L5.68198 14.0251C5.05778 14.6493 4.21118 15 3.32843 15C1.49019 15 0 13.5098 0 11.6716C0 10.7888 0.350673 9.94222 0.974874 9.31802L4.14645 6.14645L4.85355 6.85355ZM15 11H12V10H15V11ZM10 15V12H11V15H10Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
      )}
      <input
        ref={titleInputRef}
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-0 focus:border-none focus:ring-0 textarea-title font-semibold bg-zinc-50 text-base"
        placeholder="Add title"
        autoComplete="no-autocomplete-please"
        maxLength={100}
      />
      <TextareaAutosize
        ref={textAreaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 focus:border-none focus:ring-0 textarea-content resize-none font-semibold bg-zinc-50 text-sm"
        placeholder="Take a brief note..."
        minRows={4}
        autoComplete="no-autocomplete-please"
      ></TextareaAutosize>
      <div className="flex justify-between w-full pr-2 pb-1 items-center">
        <div>
          {/* Hamburger menu */}
          <button
            ref={hamburgerMenuButtonRef}
            className={`p-1 rounded-full hover:bg-zinc-200 ${
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
          {/* Popup menu */}
          {showHamburgerMenu && (
            <div
              ref={menuRef}
              className="fixed bottom-11 left-1 bg-zinc-200 rounded-md shadow-lg"
            >
              <button
                className="block w-full text-left py-2 px-2 hover:bg-zinc-300 rounded-md"
                onClick={logout}
              >
                Logout
              </button>
              <button
                className="block w-full text-left py-2 px-2 hover:bg-zinc-300 rounded-md"
                onClick={websiteRedirect}
              >
                Go to Website
              </button>
            </div>
          )}
        </div>
        <div className="text-sm">
          <button
            ref={cancelButtonRef}
            className="py-1 px-2 mr-2 bg-zinc-50 rounded hover:bg-zinc-200 font-semibold text-zinc-800"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            ref={saveButtonRef}
            className={`py-1 px-2 bg-white rounded font-semibold  ${
              saveButtonDisabled
                ? "opacity-50 cursor-not-allowed bg-zinc-50 hover:bg-zinc-50 text-zinc-800"
                : "bg-zinc-50 hover:bg-violet-100 hover:text-violet-700"
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
