import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Grid, TextField, Button, Card, CardContent, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../api/axios';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
    //   console.log(data[0]);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      setName('');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
        console.log(id);
        
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category', err);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Category Management</Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <TextField
                    label="Category Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ height: '100%' }}
                  >
                    {editingCategory ? 'Update' : 'Add'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(category)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(category.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default CategoryPage;
