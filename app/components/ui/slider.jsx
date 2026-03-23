import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center cursor-pointer",
      className
    )}
    {...props}
  >
    {/* The empty track (Slate/Gray) */}
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-800">
      {/* The filled track (Purple) */}
      <SliderPrimitive.Range className="absolute h-full bg-purple-500" />
    </SliderPrimitive.Track>
    
    {/* The draggable thumb (White with Purple border & Glow) */}
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-purple-500 bg-zinc-100 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50 hover:scale-110" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }