import { createContext, useContext, useMemo, useReducer } from "react";
import { LAB_CONFIG } from "../config/labConfig";
import {
  clampLabState,
  normalize,
  setVolumeByDrag,
  stepCompression,
  stepExpansion,
} from "../physics/jouleThomson";

const LabContext = createContext(null);

const buildInitialState = () => ({
  ...LAB_CONFIG.initialState,
});

const reducer = (state, action) => {
  switch (action.type) {
    case "COMPRESS": {
      if (!state.powerOn) return state;
      return clampLabState(
        stepCompression(state, LAB_CONFIG, state.actionIntensity),
        LAB_CONFIG.limits,
      );
    }
    case "EXPAND": {
      if (!state.powerOn) return state;
      return clampLabState(
        stepExpansion(state, LAB_CONFIG, state.actionIntensity),
        LAB_CONFIG.limits,
      );
    }
    case "SET_VOLUME": {
      return clampLabState(
        setVolumeByDrag(state, LAB_CONFIG, action.payload),
        LAB_CONFIG.limits,
      );
    }
    case "SET_INTENSITY": {
      return clampLabState(
        { ...state, actionIntensity: action.payload },
        LAB_CONFIG.limits,
      );
    }
    case "TOGGLE_POWER": {
      return { ...state, powerOn: !state.powerOn };
    }
    case "RESET": {
      return buildInitialState();
    }
    default:
      return state;
  }
};

export const LabProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  const derived = useMemo(() => {
    const { pressure, temperature, volume } = state;
    const { limits } = LAB_CONFIG;

    return {
      pressureRatio: normalize(
        pressure,
        limits.pressure.min,
        limits.pressure.max,
      ),
      temperatureRatio: normalize(
        temperature,
        limits.temperature.min,
        limits.temperature.max,
      ),
      volumeRatio: normalize(volume, limits.volume.min, limits.volume.max),
    };
  }, [state]);

  const api = useMemo(
    () => ({
      state,
      config: LAB_CONFIG,
      derived,
      actions: {
        compressGas: () => dispatch({ type: "COMPRESS" }),
        expandGas: () => dispatch({ type: "EXPAND" }),
        resetSystem: () => dispatch({ type: "RESET" }),
        setVolume: (value) => dispatch({ type: "SET_VOLUME", payload: value }),
        setIntensity: (value) =>
          dispatch({ type: "SET_INTENSITY", payload: value }),
        togglePower: () => dispatch({ type: "TOGGLE_POWER" }),
      },
    }),
    [derived, state],
  );

  return <LabContext.Provider value={api}>{children}</LabContext.Provider>;
};

export const useLabContext = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error("useLabContext must be used inside LabProvider");
  }
  return context;
};
