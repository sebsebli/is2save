// Check if task is available according fitness level
int fitness=2;
switch (fitness) {
    case 1: if (operatingSite.num_currentVolunteers_easy < operatingSite.num_currentVolunteers_easy){
            taskSelector = 2;
            bool_isFull = false;
        }else if (operatingSite.num_currentVolunteers_admin < operatingSite.num_currentVolunteers_admin)
            taskSelector = 1;
            bool_isFull = false;
            else
            bool_isFull = true;
             break;
    case 2:  if (operatingSite.num_currentVolunteers_medium < operatingSite.num_currentVolunteers_medium)
            taskSelector = 3;
            bool_isFull = false;
            else if (operatingSite.num_currentVolunteers_easy < operatingSite.num_currentVolunteers_easy)
            taskSelector = 2;
            bool_isFull = false;
            else if (operatingSite.num_currentVolunteers_admin < operatingSite.num_currentVolunteers_admin)
            taskSelector = 1;
            bool_isFull = false;
            else
            bool_isFull = true;
             break;
    case 3:   if (operatingSite.num_currentVolunteers_heavy < operatingSite.num_currentVolunteers_heavy)
            taskSelector = 4;
            bool_isFull = false;
            else if (operatingSite.num_currentVolunteers_medium < operatingSite.num_currentVolunteers_medium)
            taskSelector = 3;
            bool_isFull = false;
            else if (operatingSite.num_currentVolunteers_easy < operatingSite.num_currentVolunteers_easy)
            taskSelector = 2;
            bool_isFull = false;
            else if (operatingSite.num_currentVolunteers_admin < operatingSite.num_currentVolunteers_admin)
            taskSelector = 1;
            bool_isFull = false;
            else
            bool_isFull = true;
             break;
   
    default: bool_isFull = true;
             break;
}