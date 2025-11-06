import React from 'react';
import * as Icons from './icons'; // импорт всех иконок из index.ts

interface IconProps {
    name: keyof typeof Icons;
    size?: number;
    color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color }) => {
    const SpecificIcon = Icons[name];
    if (!SpecificIcon) return null;
    return <SpecificIcon width={size} height={size} fill={color} />;
};

export default Icon;