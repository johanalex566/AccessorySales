using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using App.DataAccess;
using App.Entities;
using System.Collections.Generic;

namespace App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessorySalesController : ControllerBase
    {
        private readonly IConfiguration _Configuration;
        DataRepository _DataRepository;

        public AccessorySalesController(IConfiguration configuration)
        {
            _Configuration = configuration;
            _DataRepository = new DataRepository(configuration);
        }

        public StoredObjectResponse Post(StoredObjectParams StoredObjectParams)
        {
            return _DataRepository.ExecuteStoredProcedure(StoredObjectParams);
        }

        [HttpGet("GetProducts")]
        public List<Product> GetProducts()
        {
            return _DataRepository.GetProducts();
        }

        [HttpGet]
        public string Get()
        {
            return "Ver. " + _Configuration.GetValue<string>("Version");
        }
    }
}
