<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Database\Eloquent\Model;

abstract class BaseService
{
    protected $model;

    public function __construct($model)
    {
        $this->model = $model;
    }
    public function all()
    {
        return $this->model->all();
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

//    public function update(Client $client, $data)
//    {
//        $item = $this->find($id);
//        $item->update($data);
//        return $item;
//    }

    public function delete(int $id)
    {
        return $this->model->destroy($id);
    }
}
