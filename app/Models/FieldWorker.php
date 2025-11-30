<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FieldWorker extends Model
{
     use HasFactory;

    protected $fillable = ['name', 'email', 'phone'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
