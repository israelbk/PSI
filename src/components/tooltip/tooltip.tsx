import React, { useMemo } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import { followCursor, inlinePositioning } from 'tippy.js';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-subtle.css';
import 'tippy.js/themes/light.css';
import './tooltip.scoped.scss';
import {getClasses} from "../../utils/utils";

export type TooltipTheme = 'light' | 'dark' | 'popover';
export type TooltipTrigger = 'hover' | 'mouseenter' | 'click' | 'focus' | 'focusin' | 'manual';
export type TooltipAppendTo = 'parent' | 'body' | Element | ((ref: Element) => Element) | undefined;

type PlacementCreator<P extends string> = P | `${P}-start` | `${P}-end`;
export type TooltipPlacement =
	| PlacementCreator<'auto'>
	| PlacementCreator<'top'>
	| PlacementCreator<'bottom'>
	| PlacementCreator<'left'>
	| PlacementCreator<'right'>;

export type TooltipProps = React.PropsWithChildren<TippyProps> & {
	trigger?: TooltipTrigger | TooltipTrigger[];
	theme?: TooltipTheme;
	placement?: TooltipPlacement;
	appendTo?: TooltipAppendTo;
	offset?: number | [number, number];

	// Legacy props
	wrapperClass?: string;
	wrapperStyle?: React.CSSProperties;
};

export function Tooltip({ arrow = true, wrapperClass, wrapperStyle, theme, children, ...props }: TooltipProps) {
	const placement: TooltipPlacement = useMemo(() => {
		if (props.placement) {
			return props.placement;
		} else {
			return theme === 'popover' ? 'bottom-start' : 'top';
		}
	}, [props.placement, theme]);

	const trigger: string | undefined = useMemo(() => {
		if (props.visible != null) {
			return undefined;
		} else if (props.trigger === 'hover') {
			return 'mouseenter focus';
		} else if (Array.isArray(props.trigger)) {
			return props.trigger.join(' ');
		} else {
			return props.trigger;
		}
	}, [props.trigger, props.visible]);

	return (
		<Tippy
			inertia
			{...props}
			arrow={arrow ?? theme !== 'popover'}
			trigger={trigger}
			placement={placement}
			animation="shift-away-subtle"
			plugins={[followCursor, inlinePositioning]}
			theme={theme}
			maxWidth={350}
			appendTo={props.appendTo === 'body' ? () => document.body : props.appendTo ?? (() => document.body)}
		>
			<div className={getClasses('tippy-child-container', wrapperClass)} style={wrapperStyle}>
				{children}
			</div>
		</Tippy>
	);
}
