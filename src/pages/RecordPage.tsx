import { memo } from "react";

export const RecordPage = (): JSX.Element => {
  return <>Hello World</>;
};

const NamedRecordPage = memo(RecordPage);
export default NamedRecordPage;
