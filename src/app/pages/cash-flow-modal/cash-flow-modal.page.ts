import {Component, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {CashFlow, CashService, Transaction} from '../../services/cash.service';

@Component({
    selector: 'app-cash-flow-modal',
    templateUrl: './cash-flow-modal.page.html',
    styleUrls: ['./cash-flow-modal.page.scss'],
})
export class CashFlowModalPage implements OnInit {

    categories = [
        {name: 'Food', icon: 'pizza'},
        {name: 'Rent', icon: 'business'},
        {name: 'Shopping', icon: 'cart'},
        {name: 'Sports', icon: 'fitness'},
        {name: 'Education', icon: 'school'},
        {name: 'Travel', icon: 'airplane'}
    ];

    // tslint:disable-next-line:variable-name
    created_at = new Date().toISOString();

    transaction: Transaction = {
        created_at: Date.now(),
        title: '',
        value: CashFlow.Expense,
        type: null,
        category: this.categories[0]
    };

    constructor(private modalCtrl: ModalController,
                private cashService: CashService,
                private toastCtrl: ToastController) {
    }

    ngOnInit() {
    }

    addTransaction() {
        this.transaction.type = +this.transaction.type;
        this.transaction.created_at = new Date(this.created_at).getTime();

        if (this.transaction.type === CashFlow.Income) {
            this.transaction.category = {name: 'Income', icon: 'cash'};
        }
        this.cashService.addTransaction(this.transaction).then(() => {
            const toast = this.toastCtrl.create({
                message: 'Transaction',
                duration: 2000
            });
            toast.then(t => t.present());
            this.modalCtrl.dismiss({
                reload: true
            });
        });
    }

    close() {
        this.modalCtrl.dismiss();
    }
}
