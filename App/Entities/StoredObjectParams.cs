using System.Collections.Generic;

namespace App.Entities
{
    public class StoredObjectParams
    {
        public List<StoredParams> StoredParams { get; set; }
        public string StoredProcedureName { get; set; }
    }
}
