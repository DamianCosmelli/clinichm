import React from 'react';

interface NavBarProps {
  tabs: { name: string; active: boolean; onClick: () => void }[];
}

const NavBar: React.FC<NavBarProps> = ({ tabs }) => {
  return (
    <div className="flex justify-between items-center bg-[#EAE9E9] p-4" style={{ height: 48 }}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`flex items-center justify-center gap-2 p-2 rounded ${
            tab.active
              ? 'bg-[rgba(133,103,59,0.15)] border-t border-l border-r border-[#85673B] text-[#111111] font-semibold'
              : 'text-[#5E5D5D]'
          }`}
          style={{ width: 175, height: 48 }}
          onClick={tab.onClick}
        >
          <span className="text-sm font-semibold">{tab.name}</span>
        </div>
      ))}
    </div>
  );
};

export default NavBar;
