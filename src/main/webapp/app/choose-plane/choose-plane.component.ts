import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { VooService } from 'app/entities/voo';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IVoo } from 'app/shared/model/voo.model';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-choose-plane',
    templateUrl: './choose-plane.component.html',
    styleUrls: ['choose-plane.css'],
    animations: [
        trigger('flipState', [
            state(
                'active',
                style({
                    transform: 'rotateY(179.9deg)'
                })
            ),
            state(
                'inactive',
                style({
                    transform: 'rotateY(0)'
                })
            ),
            transition('active => inactive', animate('500ms ease-out')),
            transition('inactive => active', animate('500ms ease-in'))
        ])
    ]
})
export class ChoosePlaneComponent implements OnInit {
    message: string;
    seats: any[][][];
    columns: any[];
	flip: string = 'inactive';
    rows: any[];
    voos: any[] = [];
    withoutVoos = false;
	passengers: number = 0;
	seatsSelected: number = 0;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private vooService: VooService,
        private jhiAlertService: JhiAlertService
    ) {
        this.route.params.subscribe(params => {
            console.log(params);
            if (params) {
                if (params.from && params.to && params.dateIn) {
					console.log("Passengers are " + params.passengers)
					this.passengers = params.passengers;
                    console.log(
                        this.vooService.findVoos(params.dateIn, params.from, params.to).subscribe(
                            (res: HttpResponse<IVoo[]>) => {
                                this.voos = res.body;
                                if (this.voos.length === 0) {
                                    this.withoutVoos = true;
                                }

								// Assigns an increasing internal ID to each flight:
								for (let i = 0; i < this.voos.length; i++){
									this.voos[i].ith = i;
								}

								// Generates airplane seats for each flight:
								this.seats = new Array();

						        const numOfSeats = 17;

						        // Plane rows:
						        this.rows = ['A', 'B', 'C', 'D'];
								// Loops through flights:
								for (let k = 0; k < this.voos.length; k++){
									console.log("Creating seats for flight " + k);
									this.seats[k] = new Array();
							        // Loops through rows:
							        for (let j = 0; j < 4; j++) {
							            this.seats[k][j] = new Array();
							            // Loops through seats:
							            for (let i = 0; i < numOfSeats; i++) {
											let seat = {
												id: this.rows[j] + (numOfSeats - i),
												checked: false
											}
							                this.seats[k][j].push(seat);
							            }
							        }
								}
                            },
                            (res: HttpErrorResponse) => this.onError(res.message)
                        )
                    );
                }
            }
        });


        this.message = 'ChoosePlaneComponent message';


    }


    ngOnInit() {}

    // Troca o estado de flip, acionando a animacao
    toggleFlip(voo) {
		console.log(voo);
        voo.flip = ((voo.flip === 'inactive') || (voo.flip === undefined)) ? 'active' : 'inactive';
    }


	selectSeat(seat) {
		console.log(seat, this.seatsSelected, this.passengers);
		if (seat.checked == false){
			seat.checked = true;
			this.seatsSelected += 1;
		} else {
			seat.checked = false;
			this.seatsSelected -= 1;
		}
	}

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
