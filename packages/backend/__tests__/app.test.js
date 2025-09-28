const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('API Endpoints', () => {
  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app).get('/api/items');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check if items have the expected structure
      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('priority');
      expect(item).toHaveProperty('created_at');
      expect(['P1', 'P2', 'P3']).toContain(item.priority);
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = { name: 'Test Item' };
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body).toHaveProperty('priority');
      expect(response.body.priority).toBe('P3'); // Default priority
      expect(response.body).toHaveProperty('created_at');
    });

    it('should create a new item with specified priority', async () => {
      const newItem = { name: 'Test Item with P1', priority: 'P1' };
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.priority).toBe('P1');
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return 400 for invalid priority', async () => {
      const newItem = { name: 'Test Item', priority: 'P4' };
      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Priority must be P1, P2, or P3');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '' })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('PUT /api/items/:id', () => {
    let testItemId;

    beforeEach(async () => {
      // Create a test item for each test
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test Item for Update' });
      testItemId = response.body.id;
    });

    it('should update item priority', async () => {
      const response = await request(app)
        .put(`/api/items/${testItemId}`)
        .send({ priority: 'P1' })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testItemId);
      expect(response.body.priority).toBe('P1');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .put(`/api/items/${testItemId}`)
        .send({ priority: 'P4' })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Priority must be P1, P2, or P3');
    });

    it('should return 400 if priority is missing', async () => {
      const response = await request(app)
        .put(`/api/items/${testItemId}`)
        .send({})
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Priority must be P1, P2, or P3');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/items/99999')
        .send({ priority: 'P1' })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item not found');
    });
  });
});