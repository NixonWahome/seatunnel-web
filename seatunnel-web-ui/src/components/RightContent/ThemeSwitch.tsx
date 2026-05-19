import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAntdConfigSetter, useIntl, useModel } from "@umijs/max";
import { Tooltip, theme } from "antd";
import React, { useCallback, useEffect } from "react";

export const THEME_STORAGE_KEY = "seatunnel-web-theme";
export const DARK_THEME = "realDark";
export const LIGHT_THEME = "light";

// Drives the html[data-theme="dark"] selector used by src/dark-mode.less.
export const applyHtmlThemeAttribute = (isDark: boolean) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
};

const ThemeSwitch: React.FC = () => {
  const { initialState, setInitialState } = useModel("@@initialState");
  const setAntdConfig = useAntdConfigSetter();
  const intl = useIntl();

  const isDark = initialState?.settings?.navTheme === DARK_THEME;

  useEffect(() => {
    applyHtmlThemeAttribute(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(async () => {
    const nextIsDark = !isDark;
    const nextTheme = nextIsDark ? DARK_THEME : LIGHT_THEME;

    setAntdConfig({
      theme: {
        algorithm: nextIsDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      },
    });

    await setInitialState((prev) => ({
      ...prev,
      settings: {
        ...prev?.settings,
        navTheme: nextTheme,
      },
    }));

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyHtmlThemeAttribute(nextIsDark);
  }, [isDark, setAntdConfig, setInitialState]);

  const tooltipTitle = intl.formatMessage({
    id: isDark ? "component.themeSwitch.toLight" : "component.themeSwitch.toDark",
  });

  return (
    <Tooltip title={tooltipTitle}>
      <div
        onClick={toggleTheme}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 999,
          cursor: "pointer",
          fontSize: 16,
          color: "inherit",
        }}
      >
        {isDark ? <SunOutlined /> : <MoonOutlined />}
      </div>
    </Tooltip>
  );
};

export default ThemeSwitch;
