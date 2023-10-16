import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { memo, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from './hooks/useUser';
import { Logout, PersonAdd, Person } from '@mui/icons-material';

const TopBar = (): JSX.Element => {
  const { user } = useUser();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box mb={3}>
      <AppBar position="static">
        <Toolbar>
          <Box flexGrow="1">ドロップ記録</Box>
          {user ? (
            <Box>
              <Box>
                <Tooltip title="アカウント設定">
                  <IconButton onClick={handleClick}>
                    <Avatar />
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  プロフィール
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  フレンド追加
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  ログアウト
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              ログインはこちらから
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const NamedTopBar = memo(TopBar);
export default NamedTopBar;
