import { NavLink } from "react-router-dom";

type TooltipIconButtonProps = {
    tooltip: string;
    icon: string;
    iconStyle: string;
    href: string;
}

export function TooltipIconButton({ icon, iconStyle, tooltip, href }: TooltipIconButtonProps) {
    return (
        <NavLink className="flex flex-col items-center has-tooltip" activeClassName="text-blue-600" to={href}>
            <i className={`${iconStyle} ${icon}`}/>
            <span className="p-1 mt-6 bg-gray-100 rounded shadow-lg tooltip">{tooltip}</span>
        </NavLink>
    );
}

TooltipIconButton.defaultProps = {
    iconStyle: "fas fa-lg"
}