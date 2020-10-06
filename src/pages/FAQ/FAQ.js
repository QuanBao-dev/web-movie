import "./FAQ.css";
import React, { useEffect, useRef, useState } from "react";
import { userStream } from "../../epics/user";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { ajax } from "rxjs/ajax";
import { pluck } from "rxjs/operators";
const FAQ = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [isContentEditable, setIsContentEditable] = useState(false);
  const contentFaqRef = useRef();
  const user = userStream.currentState();
  const [cookies] = useCookies(["idCartoonUser"]);
  useEffect(() => {
    const subscription = ajax("/api/faq")
      .pipe(pluck("response"))
      .subscribe((data) => {
        setHtmlContent(data.message);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <div className="container-faq">
      <div
        className="content-faq"
        ref={contentFaqRef}
        contentEditable={isContentEditable}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
      {user && user.role === "Admin" && (
        <div>
          <button
            className="btn btn-yellow"
            onClick={() => {
              setIsContentEditable(!isContentEditable);
            }}
          >
            Content Editable
          </button>
          <button
            className="btn btn-danger"
            id="save-button"
            onClick={async (e) => {
              e.target.disabled = true;
              const html = contentFaqRef.current.innerHTML
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">");
              try {
                const result = await Axios.post(
                  "/api/faq",
                  {
                    html: html,
                  },
                  {
                    headers: {
                      authorization: `Bearer ${cookies.idCartoonUser}`,
                    },
                  }
                );
                setHtmlContent(result.data.message);
              } catch (error) {
                console.log(error.response);
              }
              document.querySelector("#save-button").disabled = false;
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQ;
