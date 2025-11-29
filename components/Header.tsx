import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="pt-8 pb-6 px-4 text-center">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
        SoulPaper
      </h1>
      <p className="text-slate-400 text-sm mt-2">
        오늘의 기분을 배경화면으로 만들어보세요
      </p>
    </div>
  );
};

export default Header;
