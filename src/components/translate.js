import React, { useEffect, useState } from "react";
import axios from "axios";

const DICTIONARY_API_URL = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup";
const DICTIONARY_API_KEY = process.env.REACT_APP_YANDEX_DICT_KEY;

const doTranslation = async (input, languageCode, cancelToken) => {
  if (!DICTIONARY_API_KEY) {
    return "";
  }

  try {
    const { data } = await axios.post(DICTIONARY_API_URL, null, {
      params: {
        key: DICTIONARY_API_KEY,
        lang: `ru-${languageCode}`,
        text: input
      },
      cancelToken: cancelToken.token
    });

    const translation = data.def && data.def[0] && data.def[0].tr && data.def[0].tr[0];

    return translation ? translation.text : "";
  } catch (err) {
    return "";
  }
};

export default ({ language, text }) => {
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    if (!text) {
      return;
    }

    const cancelToken = axios.CancelToken.source();

    doTranslation(text, language, cancelToken).then(setTranslated);

    return () => {
      try {
        cancelToken.cancel();
      } catch (err) {}
    };
  }, [text, language]);

  return (
    <div>
      <label className="label">Output</label>
      <h1 className="title">{translated}</h1>
    </div>
  );
};
