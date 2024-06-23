import * as React from "react";

type SVGProps = React.SVGProps<SVGSVGElement>;

export const LinkIcon: React.FC<SVGProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="#111"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.121 9.879 9.88 14.12m.707-7.778.707-.707a5 5 0 0 1 7.071 7.071l-.707.707M6.343 10.586l-.707.707a5 5 0 1 0 7.071 7.071l.707-.707"
    />
  </svg>
);
