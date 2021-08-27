import { useTheme } from "@material-ui/core";
import React from "react";

export function CompanyLogoIcon() {
    const theme = useTheme();

    return (
        <svg
            version="1.1"
            id="svg2"
            width="60px"
            viewBox="0 0 1333.3333 1333.3333"
        >
            <metadata id="metadata8"></metadata>
            <defs id="defs6">
                <clipPath clipPathUnits="userSpaceOnUse" id="clipPath18">
                    <path d="M 0,1000 H 1000 V 0 H 0 Z" id="path16" />
                </clipPath>
                <clipPath clipPathUnits="userSpaceOnUse" id="clipPath34">
                    <path
                        d="M 400.992,597.098 H 620.616 V 279.266 H 400.992 Z"
                        id="path32"
                    />
                </clipPath>
            </defs>
            <g
                id="g10"
                transform="matrix(1.3333333,0,0,-1.3333333,0,1333.3333)"
            >
                <g id="g12">
                    <g id="g14" clip-path="url(#clipPath18)">
                        <g id="g20" transform="translate(429.9712,430.0234)">
                            <path
                                d="m 0,0 c -19.317,-19.358 -28.979,-44.659 -28.979,-69.997 0,-25.38 9.696,-50.685 29.014,-70.008 L -139.926,-0.041 c -19.317,19.361 -29.024,44.659 -28.983,70 0,25.31 9.624,50.648 28.983,70.003 L 0.076,279.926 c 23.496,23.496 55.875,32.735 86.342,27.602 19.61,-3.257 38.439,-12.491 53.584,-27.636 38.648,-38.646 38.648,-101.248 0,-139.895 z"
                                fill={theme.palette.primary.light}
                                id="path22"
                            />
                        </g>
                        <g id="g24" transform="translate(709.9717,430.0234)">
                            <path
                                d="m 0,0 -139.998,-139.968 c -34.644,-34.639 -88.543,-38.219 -127.156,-10.79 -4.492,3.15 -8.777,6.756 -12.812,10.753 -19.317,19.323 -29.013,44.628 -29.013,70.008 0,25.338 9.662,50.639 28.979,69.997 l 140.002,139.997 c 14.369,14.374 32.06,23.432 50.643,27.078 31.318,6.194 65.043,-2.835 89.321,-27.113 C 38.61,101.318 38.645,38.645 0,0"
                                fill={theme.palette.primary.dark}
                                id="path26"
                            />
                        </g>
                        <g id="g28">
                            <g id="g30" />
                            <g id="g42">
                                <g
                                    clip-path="url(#clipPath34)"
                                    opacity="0.699997"
                                    id="g40"
                                >
                                    <g
                                        transform="translate(620.6162,597.0981)"
                                        id="g38"
                                    >
                                        <path
                                            d="m 0,0 c -3.644,-18.583 -12.705,-36.275 -27.075,-50.65 l -139.998,-139.996 c -19.321,-19.358 -28.986,-44.659 -28.986,-70.001 0,-20.061 6.09,-40.13 18.26,-57.186 -4.491,3.15 -8.777,6.756 -12.811,10.753 -19.318,19.324 -29.014,44.628 -29.014,70.008 0,25.338 9.662,50.639 28.979,69.997 L -50.643,-27.078 C -36.273,-12.704 -18.583,-3.646 0,0"
                                            fill={theme.palette.primary.main}
                                            id="path36"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}
