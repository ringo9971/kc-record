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
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="right">
              イベント:
            </Grid>
            <Grid item xs={6}>
              <DialogContentText>{drop?.event}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="right">
              海域:
            </Grid>
            <Grid item xs={6}>
              <DialogContentText>{drop?.area}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="right">
              勝利:
            </Grid>
            <Grid item xs={6}>
              <DialogContentText>{drop?.outcome}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="right">
              勝利: ドロップ:
            </Grid>
            <Grid item xs={6}>
              <DialogContentText>{drop?.ship}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="right">
              コメント:
            </Grid>
            <Grid item xs={6}>
              <DialogContentText>{drop?.comment}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="right">
              時間:
            </Grid>
            <Grid item xs={6}>
              <DialogContentText>{formatTime(drop?.time)}</DialogContentText>
            </Grid>
          </Grid>
        </DialogContentText>
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
