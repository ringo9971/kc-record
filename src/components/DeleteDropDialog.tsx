import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material';
import { memo } from 'react';

import { Drop } from '../api/types';
import { formatTime } from '../utils/helpers';

interface DeleteDropDialogProps {
  open: boolean;
  drop: Drop | null;
  onClose: () => void;
  onCanselClick: () => void;
  onDeleteClick: () => void;
}

const TextGridItem = ({
  message,
  right,
}: {
  message?: string;
  right?: boolean;
}) => {
  return (
    <Grid item xs={6} textAlign={right ? 'right' : 'left'}>
      <DialogContentText>{message}</DialogContentText>
    </Grid>
  );
};

export const DeleteDropDialog = ({
  open,
  drop,
  onClose,
  onCanselClick,
  onDeleteClick,
}: DeleteDropDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth={true}>
      <DialogTitle>確認</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <TextGridItem message="イベント:" right={true} />
          <TextGridItem message={drop?.event} />
          <TextGridItem message="海域:" right={true} />
          <TextGridItem message={drop?.area} />
          <TextGridItem message="勝利:" right={true} />
          <TextGridItem message={drop?.outcome} />
          <TextGridItem message="勝利: ドロップ:" right={true} />
          <TextGridItem message={drop?.ship} />
          <TextGridItem message="コメント:" right={true} />
          <TextGridItem message={drop?.comment} />
          <TextGridItem message="時間:" right={true} />
          <TextGridItem message={formatTime(drop?.time)} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCanselClick}>キャンセル</Button>
        <Button onClick={onDeleteClick}>削除</Button>
      </DialogActions>
    </Dialog>
  );
};

const NamedDeleteDropDialog = memo(DeleteDropDialog);
export default NamedDeleteDropDialog;
