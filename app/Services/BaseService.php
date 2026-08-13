<?php

namespace App\Services;

abstract class BaseService
{
    protected $model;

    public function __construct($model)
    {
        $this->model = $model;
    }

    /**
     * Get all records
     */
    public function all()
    {
        return $this->model->all();
    }

    /**
     * Get paginated records
     */
    public function paginate(int $perPage = 10)
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Find a record by ID
     */
    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Create a new record
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }

    /**
     * Update an existing record
     */
    public function update(int $id, array $data)
    {
        $item = $this->find($id);

        $item->update($data);

        return $item->fresh();
    }

    /**
     * Delete a record
     */
    public function delete(int $id)
    {
        $item = $this->find($id);

        return $item->delete();
    }
}
