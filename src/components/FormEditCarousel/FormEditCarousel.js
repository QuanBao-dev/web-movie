import "./FormEditCarousel.css";

import React, { useRef } from "react";
import { useCookies } from "react-cookie";
import navBarStore from "../../store/navbar";
import { carouselStream } from "../../epics/carousel";
import Input from "../Input/Input";

const FormEditCarousel = () => {
  const [malIdInputRef, idInputRef, imageUrlInputRef] = [
    useRef(),
    useRef(),
    useRef(),
  ];
  const [cookies] = useCookies(["idCartoonUser"]);
  let styleFormWrapper = {},
    styleBackground = {},
    styleContainer = {};

  if (carouselStream.currentState().isShowFormEditCarousel) {
    styleFormWrapper = {
      transform: "translateY(0)",
    };
    styleBackground = {
      display: "block",
    };
    styleContainer = {
      zIndex: 12,
    };
  }
  return (
    <div style={styleContainer} className="form-edit-carousel-container">
      <div
        style={styleBackground}
        className="form-edit-carousel-container__background"
        onClick={() => {
          carouselStream.updateData({ isShowFormEditCarousel: false });
        }}
      ></div>
      <form className="form-edit-carousel-wrapper" style={styleFormWrapper}>
        <Input label={"Mal Id"} input={malIdInputRef} />
        <Input label={"Id (0 - 4)"} input={idInputRef} type="number" />
        <Input label={"Image Url"} input={imageUrlInputRef} />
        <input
          className="file-upload-carousel"
          type="file"
          style={{ width: "100%", marginTop: "1rem" }}
        />
        <button
          className="button-submit-carousel"
          onClick={async (e) => {
            e.preventDefault();
            const $ = document.querySelector.bind(document);
            if (
              ![
                malIdInputRef.current.value.trim(),
                imageUrlInputRef.current.value.trim(),
                idInputRef.current.value.trim(),
              ].includes("") ||
              ![
                malIdInputRef.current.value.trim(),
                idInputRef.current.value.trim(),
                $(".file-upload-carousel").value.trim(),
              ].includes("")
            )
              try {
                navBarStore.updateIsShowBlockPopUp(true);
                let url = "";
                if ($(".file-upload-carousel").value.trim() !== "") {
                  url = await base64DataUrl(
                    $(".file-upload-carousel").files[0]
                  );
                } else {
                  url = imageUrlInputRef.current.value;
                }
                const res = await fetch(
                  "/api/movies/carousel/" + idInputRef.current.value,
                  {
                    method: "PUT",
                    body: JSON.stringify({
                      malId: malIdInputRef.current.value,
                      url,
                    }),

                    headers: {
                      authorization: `Bearer ${cookies.idCartoonUser}`,
                      "Content-Type":"application/json"
                    },
                  }
                );
                const resJson = await res.json();
                if (resJson.error) throw Error("Some things went wrong");
                carouselStream.updateData({
                  dataCarousel: resJson.message,
                  isShowFormEditCarousel: false,
                });
              } catch (error) {}
            navBarStore.updateIsShowBlockPopUp(false);
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

function base64DataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = function () {
      reject("Your file is too big");
    };
    reader.onload = function (ev) {
      reader.error && reject(reader.error);
      resolve(ev.target.result);
    };
    reader.readAsDataURL(file);
  });
}

export default FormEditCarousel;
