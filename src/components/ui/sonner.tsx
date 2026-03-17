"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Alert02Icon,
  MultiplicationSignCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
        ),
        info: (
          <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-4" />
        ),
        warning: (
          <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-4" />
        ),
        error: (
          <HugeiconsIcon icon={MultiplicationSignCircleIcon} strokeWidth={2} className="size-4" />
        ),
        loading: (
          <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-start gap-3 w-full px-4 py-3.5 rounded-2xl border text-sm font-medium shadow-sm",

          // success — green tint
          success:
            "bg-green-50 border-green-200 text-green-800 [&>[data-icon]]:text-green-500",

          // info — blue tint
          info:
            "bg-blue-50 border-blue-200 text-blue-800 [&>[data-icon]]:text-blue-500",

          // warning — amber tint
          warning:
            "bg-amber-50 border-amber-200 text-amber-800 [&>[data-icon]]:text-amber-500",

          // error — red tint
          error:
            "bg-red-50 border-red-200 text-red-800 [&>[data-icon]]:text-red-500",

          // loading — neutral
          loading:
            "bg-gray-50 border-gray-200 text-gray-700 [&>[data-icon]]:text-gray-400",

          icon: "flex-shrink-0 mt-0.5",
          title: "font-semibold leading-snug",
          description: "text-xs font-normal opacity-80 mt-0.5 leading-relaxed",
          actionButton:
            "mt-2 text-xs font-semibold underline underline-offset-2 cursor-pointer",
          cancelButton:
            "mt-2 text-xs font-medium opacity-60 cursor-pointer",
          closeButton:
            "ml-auto opacity-40 hover:opacity-70 transition-opacity",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }