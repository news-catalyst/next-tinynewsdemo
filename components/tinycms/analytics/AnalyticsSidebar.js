import React from 'react';
import tw from 'twin.macro';

const Panel = tw.div`w-full mb-2 border-solid border-gray-300 rounded border shadow-sm`;
const PanelHeader = tw.div`bg-gray-100 px-2 py-3 border-solid border-gray-300 border-b font-bold text-xl`;
const PanelContent = tw.div`p-3`;

const AnalyticsSidebar = (props) => {
  return (
    <Panel>
      <PanelHeader>{props.title}</PanelHeader>
      <PanelContent>{props.children}</PanelContent>
    </Panel>
  );
};

AnalyticsSidebar.displayName = 'AnalyticsSidebar';

export default AnalyticsSidebar;
