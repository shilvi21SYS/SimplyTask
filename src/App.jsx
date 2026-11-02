import { useMemo, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent,
  Stack, Chip, TextField, Checkbox, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, LinearProgress, Paper, InputAdornment,
  useMediaQuery, useTheme
} from '@mui/material';
import {
  Add, Dashboard, Checklist, Search,
  DeleteOutline, Edit, FormatListBulleted
} from '@mui/icons-material';

const initialTasks = [
  { id: 1, title: 'Menyelesaikan tugas React JS', category: 'Kuliah', due: '2026-10-31', done: false },
  { id: 2, title: 'Membaca materi Material UI', category: 'Kuliah', due: '2026-10-30', done: true },
  { id: 3, title: 'Merapikan catatan perkuliahan', category: 'Pribadi', due: '2026-11-01', done: false },
  { id: 4, title: 'Membuat daftar kegiatan mingguan', category: 'Pribadi', due: '2026-11-02', done: false }
];

const emptyForm = { title: '', category: 'Kuliah', due: '' };

const CATEGORY_STYLE = {
  Kuliah:    { bg: '#eff6ff', color: '#1d4ed8' },
  Pribadi:   { bg: '#f0fdf4', color: '#15803d' },
  Pekerjaan: { bg: '#fefce8', color: '#a16207' },
};

function StatCard({ label, value, sub }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography fontSize={11} fontWeight={600} color="text.secondary" textTransform="uppercase" letterSpacing={0.6}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ my: 0.5, fontWeight: 600 }}>{value}</Typography>
        <Typography fontSize={13} color="text.secondary">{sub}</Typography>
      </CardContent>
    </Card>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const style = CATEGORY_STYLE[task.category] || { bg: '#f3f4f6', color: '#374151' };
  const dateStr = task.due
    ? new Date(`${task.due}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Tanpa tenggat';

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderColor: '#e5e7eb', borderRadius: 1.5 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Checkbox checked={task.done} onChange={() => onToggle(task.id)} color="primary" size="small" />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            fontSize={14}
            fontWeight={task.done ? 400 : 500}
            sx={{
              textDecoration: task.done ? 'line-through' : 'none',
              color: task.done ? 'text.secondary' : 'text.primary',
              overflowWrap: 'anywhere'
            }}
          >
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={task.category}
              sx={{ bgcolor: style.bg, color: style.color, fontWeight: 500, fontSize: 11, height: 20, borderRadius: 1 }}
            />
            <Typography variant="caption" color="text.secondary">{dateStr}</Typography>
          </Stack>
        </Box>
        <IconButton size="small" aria-label="Edit" onClick={() => onEdit(task)}>
          <Edit sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" aria-label="Hapus" color="error" onClick={() => onDelete(task.id)}>
          <DeleteOutline sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Paper>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Semua' || (filter === 'Selesai' ? task.done : !task.done);
    return matchesQuery && matchesFilter;
  }), [tasks, query, filter]);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = task => {
    setEditingId(task.id);
    setForm({ title: task.title, category: task.category, due: task.due });
    setDialogOpen(true);
  };
  const saveTask = () => {
    if (!form.title.trim()) return;
    if (editingId !== null) {
      setTasks(old => old.map(t => t.id === editingId ? { ...t, ...form, title: form.title.trim() } : t));
    } else {
      setTasks(old => [{ ...form, title: form.title.trim(), id: Date.now(), done: false }, ...old]);
    }
    setDialogOpen(false);
  };
  const toggleTask = id => setTasks(old => old.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = id => setTasks(old => old.filter(t => t.id !== id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      {/* Navbar */}
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb', bgcolor: '#fff' }}>
        <Toolbar sx={{ maxWidth: 1120, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <FormatListBulleted sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="h6" fontWeight={600} letterSpacing={-0.3} color="text.primary">
              Taskly
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Button
              size="small"
              startIcon={!isMobile && <Dashboard sx={{ fontSize: 16 }} />}
              color={page === 'dashboard' ? 'primary' : 'inherit'}
              variant={page === 'dashboard' ? 'contained' : 'text'}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              size="small"
              startIcon={!isMobile && <Checklist sx={{ fontSize: 16 }} />}
              color={page === 'tasks' ? 'primary' : 'inherit'}
              variant={page === 'tasks' ? 'contained' : 'text'}
              onClick={() => setPage('tasks')}
            >
              Tugas
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>

        {/* Page header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {page === 'dashboard' ? 'Dashboard' : 'Daftar Tugas'}
            </Typography>
            <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>
              {page === 'dashboard'
                ? 'Ringkasan tugas dan progres kamu.'
                : 'Semua tugas yang perlu kamu kerjakan.'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAdd}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Tambah Tugas
          </Button>
        </Stack>

        {page === 'dashboard' ? (
          <>
            {/* Stat cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <StatCard label="Total Tugas" value={tasks.length} sub="Semua tugas" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard label="Belum Selesai" value={pending} sub="Perlu dikerjakan" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard label="Selesai" value={completed} sub="Sudah diselesaikan" />
              </Grid>
            </Grid>

            {/* Progress */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography fontWeight={500} fontSize={14}>Progress</Typography>
                  <Typography fontWeight={600} fontSize={14} color="primary.main">{progress}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {completed} dari {tasks.length} tugas selesai
                </Typography>
              </CardContent>
            </Card>

            {/* Recent tasks */}
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography fontWeight={600} fontSize={15}>Tugas terbaru</Typography>
                  <Button size="small" onClick={() => setPage('tasks')}>Lihat semua</Button>
                </Stack>
                <Stack spacing={1}>
                  {tasks.slice(0, 4).map(task => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} />
                  ))}
                  {tasks.length === 0 && (
                    <Typography color="text.secondary" textAlign="center" fontSize={14} py={3}>
                      Belum ada tugas. Tambahkan tugas pertamamu.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
                <TextField
                  placeholder="Cari tugas..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  sx={{ maxWidth: { sm: 320 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField select value={filter} onChange={e => setFilter(e.target.value)} sx={{ minWidth: 140 }}>
                  <MenuItem value="Semua">Semua</MenuItem>
                  <MenuItem value="Belum selesai">Belum selesai</MenuItem>
                  <MenuItem value="Selesai">Selesai</MenuItem>
                </TextField>
              </Stack>
              <Stack spacing={1}>
                {visibleTasks.map(task => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} />
                ))}
                {visibleTasks.length === 0 && (
                  <Typography color="text.secondary" textAlign="center" fontSize={14} py={4}>
                    Tidak ada tugas yang ditemukan.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
          Taskly &middot; {new Date().getFullYear()}
        </Typography>
      </Container>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600, fontSize: 16 }}>
          {editingId !== null ? 'Edit Tugas' : 'Tambah Tugas'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Nama tugas"
              placeholder="Contoh: Mengerjakan tugas kuliah"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
            <TextField select label="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <MenuItem value="Kuliah">Kuliah</MenuItem>
              <MenuItem value="Pribadi">Pribadi</MenuItem>
              <MenuItem value="Pekerjaan">Pekerjaan</MenuItem>
            </TextField>
            <TextField
              label="Tenggat waktu"
              type="date"
              value={form.due}
              onChange={e => setForm({ ...form, due: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={saveTask} disabled={!form.title.trim()}>Simpan</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
