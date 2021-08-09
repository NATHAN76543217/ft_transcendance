import { UserRole } from 'src/users/utils/userRole';

export default interface UpdateRoleDto {
  user_id: number;
  role: UserRole;
}
