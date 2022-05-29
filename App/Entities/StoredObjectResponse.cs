using System;
using System.Collections.Generic;

namespace App.Entities
{
    public class StoredObjectResponse
    {
        public Exception Exception { get; set; }
        public string ValueResponse { get; set; }
        public List<StoredTableResponse> Value { get; set; }
    }
}
