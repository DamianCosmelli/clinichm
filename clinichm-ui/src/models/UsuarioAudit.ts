export interface UsuarioAudit {
  id: number;
  usuarioId: number;
  loginTime?: Date;
  logoutTime?: Date;
  ip?: string;
  navegador?: string;
  sesion: string;
}
