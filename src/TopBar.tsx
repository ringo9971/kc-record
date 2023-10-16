import { Logout, PersonAdd, Person } from '@mui/icons-material';
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
import { Link, useNavigate } from 'react-router-dom';

import { useLogout } from './hooks/useLogout';
import { useUser } from './hooks/useUser';

const TopBar = (): JSX.Element => {
  const { user } = useUser();
  const { logout } = useLogout();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

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
          <Box flexGrow="1">
            <Button component={Link} to="/" color="inherit">
              ドロップ記録
            </Button>
          </Box>
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
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  プロフィール
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate('/friends')}>
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  フレンド追加
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout}>
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
