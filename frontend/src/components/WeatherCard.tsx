import { useTranslation } from "react-i18next";
import {useEffect,useState,} from "react";

import {cacheWeather } from "../utils/cacheWeather";

import {getCachedWeather } from "../utils/getCachedWeather";

import axios from "axios";
import toast from "react-hot-toast";
import API from "../api/axios";

interface WeatherData {
  name: string;

  main: {
    temp: number;
    humidity: number;
  };

  weather: {
    main: string;
    description: string;
    icon: string;
  }[];

  wind: {
    speed: number;
  };
}

const WeatherCard = () => {
  const { t } = useTranslation();
  const [weather, setWeather] =
    useState<WeatherData | null>(
      null
    );

  const [inputCity, setInputCity] =
  useState("");

  const [loading, setLoading] =
    useState(true);

  const [cityUpdating, setCityUpdating] =
    useState(false);

  // CITY

  const [city, setCity] =
  useState("Meerut");

  

  const fetchSettings =
    async () => {
        try {
        const token =
            localStorage.getItem(
            "token"
            );

        const res = await API.get(
            "/settings",
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        const savedCity =
            res.data.data.city ||
            "Meerut";

            setCity(savedCity);

            setInputCity(savedCity);

        } catch (error) {
        console.log(error);
        }
    };

  // API KEY

  const apiKey =
    import.meta.env
      .VITE_WEATHER_API_KEY;

  // FETCH WEATHER

  const updateCity =
    async () => {
        if (cityUpdating) return;

        setCityUpdating(true);

        try {
        const token =
            localStorage.getItem(
            "token"
            );

        await API.put(
        "/settings/city",
            {
            city: inputCity,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setCity(inputCity);
        toast.success(
          t("cityUpdated")
          );

        } catch (error) {
          toast.error(
           t("cityUpdateFailed")
           );
        } finally {
          setCityUpdating(false);
        }
    };


 const fetchWeather =
  async () => {

    try {

      const res =
        await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

      setWeather(
        res.data
      );

      await cacheWeather(
        res.data
      );

    } catch (error) {

      const cached =
        await getCachedWeather();

      if (cached) {

        setWeather(
          cached
        );

      }

    } finally {

      setLoading(false);

    }
};

  useEffect(() => {
    fetchSettings();
  }, []);


  useEffect(() => {
    const loadWeather =
      async () => {
        const cached =await getCachedWeather();
        if (cached) {
          setWeather(cached);
          setLoading(false);
        }
        if (city) {
          fetchWeather();
        }
      };
    loadWeather();
  }, [city]);


    const getBackgroundImage =
    () => {
      const condition =
        weather?.weather[0]?.main;

      switch (condition) {
        case "Clear":
          return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1974&auto=format&fit=crop";

        case "Clouds":
          return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1974&auto=format&fit=crop";

        case "Rain":
          return "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop";

        case "Thunderstorm":
          return "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1974&auto=format&fit=crop";

        case "Mist":
          return "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1974&auto=format&fit=crop";

        default:
          return "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop";
      }
    };

  // LOADING

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow">{t("loadingWeather")}</div>
    );
  }

  // NO DATA

  if (!weather) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow">{t("weatherLoadFailed")}</div>
    );
  }

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        shadow-lg
        text-white
        p-6
        bg-cover
        bg-center
        min-h-[320px]
      "
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
      }}
    >

      {/* OVERLAY */}

      <div
        className="
          absolute
          inset-0
          bg-black/45
        "
      ></div>

      {/* CONTENT */}

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold">{t("weather")}</h2>

            <p className="text-gray-200 mt-1">
              {weather.name}
            </p>

          </div>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
            className="w-20 h-20"
          />

        </div>

        {/* CITY SEARCH */}

        <div
        className="
            mt-5
            flex
            flex-col
            sm:flex-row
            gap-3
        "
        >

        <input
            type="text"
            value={inputCity}
            onChange={(e) =>
            setInputCity(
                e.target.value
            )
            }
            placeholder={t("enterCity")}
            className="
            flex-1
            bg-white/15
            backdrop-blur-md
            border
            border-white/20
            rounded-2xl
            px-4
            py-3
            outline-none
            text-white
            placeholder:text-gray-300
            "
        />

        <button
            disabled={cityUpdating}
            onClick={updateCity}
            className="
            bg-green-600
            hover:bg-green-700
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition-all
            px-5
            py-3
            rounded-2xl
            font-semibold
            whitespace-nowrap
            cursor-pointer
            "
        >{cityUpdating ? t("saving") : t("changeCity")}</button>

        </div>

        {/* TEMPERATURE */}

        <div className="mt-6">

          <h1 className="text-6xl font-bold">
            {Math.round(
              weather.main.temp
            )}
            °C
          </h1>

          <p className="text-lg capitalize text-gray-200 mt-2">
            {
              weather.weather[0]
                .description
            }
          </p>

        </div>

        {/* DETAILS */}

        <div
          className="
            grid
            grid-cols-2
            gap-4
            mt-8
          "
        >

          {/* HUMIDITY */}

          <div
            className="
              bg-white/15
              backdrop-blur-md
              rounded-2xl
              p-4
              border
              border-white/20
            "
          >

            <p className="text-sm text-gray-200">{t("humidity")}</p>

            <h3 className="text-2xl font-bold mt-2">
              {
                weather.main
                  .humidity
              }
              %
            </h3>

          </div>

          {/* WIND */}

          <div
            className="
              bg-white/15
              backdrop-blur-md
              rounded-2xl
              p-4
              border
              border-white/20
            "
          >

            <p className="text-sm text-gray-200">{t("windSpeed")}</p>

            <h3 className="text-2xl font-bold mt-2">
              {
                weather.wind.speed
              }{" "}
              km/h
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
};

export default WeatherCard;
