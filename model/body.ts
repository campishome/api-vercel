export interface MoviePostRequest {
    movie_id:      number;
    movie_name:    string;
    movie_picture: string;
    movie_rating:  string;
    movie_vdo:     string;
    movie_detail:  string;
    movie_time:    string;
}

export interface TypePostRequest {
    movie_id:   number;
    type: string;
}

export interface PersonPostRequest {
    person_id:      number;
    person_name:    string;
    person_picture: string;
    person_age:     string;
    person_info:    string;
}

export interface RolePostRequest {
    role_id:   number;
    role_type: string;
}

export interface MovieResult {
    movie_id: number;
    movie_name: string;
    movie_picture: string;
    movie_rating: number;
    movie_vdo: string;
    movie_detail: string;
    movie_time: string;
    type: string;
  }

  export interface StarPostRequest {
    star_id:   number;
    movie_id:  number;
    person_id: number;
    role:      String;
}
export interface CreatorPostRequest {
    creator_id: number;
    movie_id:   number;
    person_id:  number;
    type:       string;
}
