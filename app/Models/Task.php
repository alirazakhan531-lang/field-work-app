<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['field_worker_id', 'title', 'description', 'status'];

    public function fieldWorker()
    {
        return $this->belongsTo(FieldWorker::class);
    }
}
