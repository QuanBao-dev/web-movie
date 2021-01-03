import "./FormEditCarousel.css";

import Axios from "axios";
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
        <button
          className="button-submit-carousel"
          onClick={async () => {
            const $ = document.querySelector.bind(document);
            $(".button-submit-carousel").disabled = true;
            navBarStore.updateIsShowBlockPopUp(true);
            if (
              ![
                malIdInputRef.current.value.trim(),
                imageUrlInputRef.current.value.trim(),
                idInputRef.current.value.trim(),
              ].includes("")
            )
              try {
                const { data } = await Axios.put(
                  "/api/movies/carousel/" + idInputRef.current.value,
                  {
                    malId: malIdInputRef.current.value,
                    url: imageUrlInputRef.current.value,
                  },
                  {
                    headers: {
                      authorization: `Bearer ${cookies.idCartoonUser}`,
                    },
                  }
                );
                carouselStream.updateData({
                  dataCarousel: data.message,
                  isShowFormEditCarousel: false,
                });
                navBarStore.updateIsShowBlockPopUp(false);
              } catch (error) {}
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormEditCarousel;
