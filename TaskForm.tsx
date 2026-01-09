import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { Task } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    payload: Omit<Task, 'id' | 'createdAt' | 'completedAt'> & { id?: string }
  ) => void;
  existingTitles: string[];
  initial: Task | null;
}

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  existingTitles,
  initial,
}: Props) {
  const [title, setTitle] = useState('');
  const [revenue, setRevenue] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(1);
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [status, setStatus] = useState<Task['status']>('Todo');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setRevenue(initial.revenue);
      setTimeTaken(initial.timeTaken);
      setPriority(initial.priority);
      setStatus(initial.status);
      setNotes(initial.notes ?? '');
    } else {
      setTitle('');
      setRevenue(0);
      setTimeTaken(1);
      setPriority('Medium');
      setStatus('Todo');
      setNotes('');
    }
  }, [initial, open]);

  const handleSubmit = () => {
    const payload: Omit<
      Task,
      'id' | 'createdAt' | 'completedAt'
    > & { id?: string } = {
      id: initial?.id,
      title: title.trim(),
      revenue,
      timeTaken,
      priority,
      status,
      notes: notes || undefined,
    };

    onSubmit(payload);
    onClose();
  };

  const titleExists =
    !initial &&
    existingTitles
      .map((t) => t.toLowerCase())
      .includes(title.trim().toLowerCase());

  const isInvalid =
    !title.trim() ||
    revenue < 0 ||
    timeTaken <= 0 ||
    titleExists;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initial ? 'Edit Task' : 'Add Task'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleExists}
            helperText={titleExists ? 'Task title already exists' : ''}
            fullWidth
            autoFocus
          />

          <TextField
            label="Revenue"
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            fullWidth
          />

          <TextField
            label="Time Taken (hours)"
            type="number"
            value={timeTaken}
            onChange={(e) => setTimeTaken(Number(e.target.value))}
            fullWidth
          />

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as Task['priority'])
            }
            fullWidth
          >
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Task['status'])
            }
            fullWidth
          >
            <MenuItem value="Todo">Todo</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </TextField>

          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isInvalid}
        >
          {initial ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
