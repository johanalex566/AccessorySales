using System.Collections.Generic;

namespace App.Entities
{
    public class StoredTableResponse
    {
        public List<string> Columns { get; set; }
        public List<List<string>> Rows { get; set; }
        public string TableName { get; set; }
    }
}
