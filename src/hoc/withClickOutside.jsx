import React, { useEffect, useRef, useState } from "react";

export default function withClickOutside(WrappedComponent) {
  const Component = (props) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (ev) => {
        if (!ref.current?.contains(ev.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
      <WrappedComponent {...props} open={open} setOpen={setOpen} ref={ref} />
    );
  };

  return Component;
}
