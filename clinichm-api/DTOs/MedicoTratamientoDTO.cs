namespace clinichm_api.DTOs
{
    public class MedicoTratamientoDTO
    {
        public int MedicoId { get; set; }
        public int TratamientoId { get; set; }
    }

    public class MedicoTratamientoResponseDTO
    {
        public int Id { get; set; }
        public int MedicoId { get; set; }
        public int TratamientoId { get; set; }
    }
}
