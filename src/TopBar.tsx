import { Logout, PersonAdd, Person, Settings } from '@mui/icons-material';
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
import { memo, useState, MouseEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLogout } from './hooks/useLogout';
import { useUser } from './hooks/useUser';
import { useDropsContext } from './lib/DropsContext';
import { useEventsAreasContext } from './lib/EventsAreasContext';
import { useFriendsContext } from './lib/FriendsContext';
import { useRareContext } from './lib/RareContext';
import { useResourcesContext } from './lib/ResourceContext';

const TopBar = (): JSX.Element => {
  const { user, loading } = useUser();
  const { logout } = useLogout();

  const { getDrops } = useDropsContext();
  const { getEventsAreas } = useEventsAreasContext();
  const { getFriends } = useFriendsContext();
  const { getRareDrops } = useRareContext();
  const { getResources } = useResourcesContext();

  const [first, setFirst] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!first || loading || !user) return;
    getDrops();
    getEventsAreas();
    getFriends();
    getRareDrops();
    getResources();
    setFirst(false);
  }, [
    first,
    loading,
    user,
    getDrops,
    getEventsAreas,
    getFriends,
    getRareDrops,
    getResources,
  ]);

  return (
    <Box mb={1}>
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
                <MenuItem onClick={() => navigate('/settings')}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  設定
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
            !loading && (
              <Button component={Link} to="/login" color="inherit">
                ログインはこちらから
              </Button>
            )
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const NamedTopBar = memo(TopBar);
export default NamedTopBar;
