using System.Text;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using NuGet.Protocol;
using Serilog;

namespace clinichm_api.Utils
{
    public class NotFoundResultFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Loguear información de la request
            var request = context.HttpContext.Request;
            var requestInfo = new StringBuilder();

            requestInfo.AppendLine($"Método: {request.Method}");
            requestInfo.AppendLine($"Ruta: {request.Path}");
            
            // Si tiene query params, los agregamos
            if (request.QueryString.HasValue)
            {
                requestInfo.AppendLine($"QueryString: {request.QueryString}");
            }

            // Leer el body si es posible
            if (request.Body.CanSeek)
            {
                request.Body.Seek(0, SeekOrigin.Begin);
                using (var reader = new StreamReader(request.Body, Encoding.UTF8, true, 1024, true))
                {
                    string body = reader.ReadToEndAsync().Result;
                    requestInfo.AppendLine($"Body: {body}");
                }
                request.Body.Seek(0, SeekOrigin.Begin);
            }

            // Verificamos si es un NotFound y todavía no se ha enviado la respuesta
            if (context.Result is NotFoundResult || context.Result is NotFoundObjectResult)
            {
                Log.Error("Recurso no encontrado(NotFound) - Información de la request:\n{RequestInfo}", requestInfo.ToString());
                context.Result = new ObjectResult(new 
                { 
                    message = "Recurso no encontrado",
                    details = requestInfo.ToString().Split("\n")[1].Replace("'\'","")
                    
                })
                {
                    StatusCode = 404
                };
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }
    }
}