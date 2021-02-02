import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

export enum BorderSide {
  ALL = 'ALL',
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
}

interface ThemeContextType {
  themes: { [id: string]: ThemeConfig }
  themeName: string
  currentTheme: ThemeConfig
  switchTheme: (name: string) => void
  getColor: (name: string, theme?: string) => void
  getBackgroundColor: (name: string, theme?: string) => void
  getTextColor: (name: string, theme?: string) => void
  getBorderColor: (name: string, side?: BorderSide, theme?: string) => void
}

const ThemeContext = createContext<ThemeContextType>({} as never)

export interface ThemeConfig {
  [id: string]: string
}

interface Props {
  themes: { [id: string]: ThemeConfig }
  children: ReactNode | ReactNode[]
}

export function ThemeProvider({ themes = {}, children }: Props) {
  const [themeName, switchTheme] = useState(() => Object.keys(themes)[0])

  const getColor = useCallback(
    (name: string, theme?: string) => {
      if (name == undefined) {
        return undefined
      }
      const color = themes?.[theme || themeName]?.[name]
      if (__DEV__ && !color) {
        throw new Error(`Undefined color "${name}" in the theme "${theme}"!`)
      }
      return color
    },
    [themeName, themes],
  )

  const getBackgroundColor = useCallback(
    (name: string, theme?: string) => {
      if (name == undefined) {
        return undefined
      }
      return { backgroundColor: getColor(name, theme) }
    },
    [getColor],
  )

  const getTextColor = useCallback(
    (name: string, theme?: string) => {
      if (name == undefined) {
        return undefined
      }
      return { color: themes?.[theme || themeName]?.[name] }
    },
    [themeName, themes],
  )

  const getBorderColor = useCallback(
    (name: string, sides: BorderSide = BorderSide.ALL, theme?: string) => {
      if (name == undefined) {
        return undefined
      }
      const color = getColor(name, theme)
      if (sides.includes(BorderSide.ALL)) {
        return { borderColor: color }
      }
      if (sides.includes(BorderSide.TOP)) {
        return { borderTopColor: color }
      }
      if (sides.includes(BorderSide.RIGHT)) {
        return { borderRightColor: color }
      }
      if (sides.includes(BorderSide.BOTTOM)) {
        return { borderBottomColor: color }
      }
      if (sides.includes(BorderSide.LEFT)) {
        return { borderLeftColor: color }
      }
    },
    [getColor],
  )

  const value = useMemo((): ThemeContextType => {
    return {
      themes,
      themeName,
      currentTheme: themes[themeName],
      switchTheme,
      getColor,
      getBackgroundColor,
      getTextColor,
      getBorderColor,
    }
  }, [themes, themeName, getColor, getBackgroundColor, getTextColor, getBorderColor])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}